export const applyTransformations = (data, mapping) => {
  let transformedData = {};

  // Helper function to set values in a nested object structure
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;
    while (keys.length > 1) {
      const key = keys.shift();
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    current[keys[0]] = value;
  };

  Object.keys(mapping).forEach((key) => {
    if (typeof mapping[key] === "string") {
      // Direct field mapping
      setNestedValue(transformedData, mapping[key], data[key]);
    } else if (typeof mapping[key] === "object") {
      if (mapping[key].condition) {
        try {
          // Evaluate the condition dynamically
          const condition = mapping[key].condition.replace(
            /\b(\w+)\b/g,
            (match) =>
              data[match] !== undefined ? JSON.stringify(data[match]) : match,
          );

          if (new Function(`return ${condition}`)()) {
            // Evaluate the value expression if the condition is true
            const valueExpression = mapping[key].value.replace(
              /\b(\w+)\b/g,
              (match) =>
                data[match] !== undefined ? JSON.stringify(data[match]) : match,
            );

            let evaluatedValue = new Function(`return ${valueExpression}`)();

            // Ensure numerical values have 2 decimal places
            if (typeof evaluatedValue === "number") {
              evaluatedValue = parseFloat(evaluatedValue.toFixed(2));
            }

            // Handle location mapping separately
            if (key === "location") {
              if (!transformedData.location) {
                transformedData.location = {};
              }
              transformedData.location.code = evaluatedValue;
            } else {
              setNestedValue(transformedData, key, evaluatedValue);
            }
          }
        } catch (error) {
          console.error(
            `Error evaluating condition: ${mapping[key].condition}`,
            error,
          );
        }
      } else if (mapping[key].transform === "calculateAge") {
        // Calculate age from date of birth
        const birthDate = new Date(data[mapping[key].source]);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          setNestedValue(transformedData, key, age);
        } else {
          console.error(
            `Invalid date format for: ${data[mapping[key].source]}`,
          );
        }
      }
    }
  });

  return transformedData;
};
