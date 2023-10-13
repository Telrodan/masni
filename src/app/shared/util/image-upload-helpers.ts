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

export const addImagesToFormAndSetPreview = (
  event: Event,
  form: FormGroup
): string[] => {
  const files = Array.from((event.target as HTMLInputElement).files);
  const imagesPreview = [];

  form.patchValue({ images: files });
  form.get('images').updateValueAndValidity();

  if (files && files[0]) {
    const numberOfFiles = files.length;
    for (let i = 0; i < numberOfFiles; i++) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        imagesPreview.push(e.target.result);
      };

      reader.readAsDataURL(files[i]);
    }
  }
  form.markAsDirty();

  return imagesPreview;
};

export const removeImageFromFormAndInputAndClearPreview = (
  form: FormGroup,
  input: HTMLInputElement
): string => {
  form.patchValue({ image: '' });
  form.get('image').updateValueAndValidity();
  input.value = '';

  return '';
};

export const removeImagesFromFormAndInputAndClearPreview = (
  form: FormGroup,
  input: HTMLInputElement
): string[] => {
  form.patchValue({ images: '' });
  form.get('images').updateValueAndValidity();
  input.value = '';

  return [''];
};
