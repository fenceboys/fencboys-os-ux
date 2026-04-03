// Load test PDF at runtime
export const loadTestPdf = async (): Promise<string> => {
  const response = await fetch('/test-proposal.pdf');
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
