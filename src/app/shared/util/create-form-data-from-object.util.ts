export function createFormDataFromObject(object: object): FormData {
    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return formData;
}
