export function createFormDataFromObject(object: object): FormData {
    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value !== undefined && value !== null && !Array.isArray(value)) {
            formData.append(key, value);
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(`${key}`, item);
            });
        }
    });

    return formData;
}
