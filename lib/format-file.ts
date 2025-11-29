export function formatFileNameAsTitle(fileName: string): string {
    // 1. Remove file extension and replace special characters with spaces
    const withoutExtension = fileName.replace(/\.[^/.]+$/, '');

    // 2. Replace dashes and underscores with spaces
    const withoutSpaces = withoutExtension
        .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase

    // 3. Convert to title case (capitalize first letter of each word)
    const returnWithSpaces = withoutSpaces
        .split(' ')
        .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
        .trim();

    return returnWithSpaces;
}