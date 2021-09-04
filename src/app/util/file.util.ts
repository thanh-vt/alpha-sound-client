export function checkAudioSelected(formData: FormData): boolean {
  return !!formData.get('audio');
}
