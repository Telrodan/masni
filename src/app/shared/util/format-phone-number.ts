export const formatPhoneNumber = (input: string) => {
  const regex = /^(\d{4})(\d{3})(\d{4})$/;
  const formattedPhoneNumber = input.replace(regex, '$1/$2-$3');

  return formattedPhoneNumber;
};
