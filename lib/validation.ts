
export function validateBDPhoneNumber(phone: string): boolean {
    const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return regex.test(phone);
}

export function formatBDPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('8801')) {
        return '+' + cleaned;
    }
    if (cleaned.startsWith('01')) {
        return '+88' + cleaned;
    }
    if (cleaned.startsWith('1')) {
        return '+880' + cleaned;
    }
    return phone;
}
