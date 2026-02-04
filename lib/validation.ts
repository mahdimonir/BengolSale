
export function validateBDPhoneNumber(phone: string): boolean {
    // Basic regex for BD phone number: starts with +8801 or 8801 or 01, followed by 3-9, then 8 digits
    const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return regex.test(phone);
}

export function formatBDPhoneNumber(phone: string): string {
    // Normalize to +8801xxxxxxxxx
    let cleaned = phone.replace(/\D/g, ''); // User might input dashes or spaces

    if (cleaned.startsWith('8801')) {
        return '+' + cleaned;
    }
    if (cleaned.startsWith('01')) {
        return '+88' + cleaned;
    }
    if (cleaned.startsWith('1')) { // edge case if they missed leading 0
        return '+880' + cleaned;
    }
    return phone; // fallback if already formatted or unusual
}
