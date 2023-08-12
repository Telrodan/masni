import { FormGroup } from '@angular/forms';

export const addImageToFormAndSetPreview = async (
  event: Event,
  form: FormGroup
): Promise<string> => {
  const file = (event.target as HTMLInputElement).files[0];
  let imagePreview = '';

  form.patchValue({ image: file });
  form.get('image').updateValueAndValidity();

  const imagePreviewPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

  imagePreview = await imagePreviewPromise;
  form.markAsDirty();

  return imagePreview;
};

export const removeImageFromFormAndInputAndClearPreview = (
  form: FormGroup,
  input: HTMLInputElement
): string => {
  const imagePreview = '';
  form.patchValue({ image: '' });
  form.get('image').updateValueAndValidity();
  input.value = '';

  return imagePreview;
};
