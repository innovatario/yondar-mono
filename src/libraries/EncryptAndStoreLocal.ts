// Function to encrypt the private key and save it to localStorage
const defaultPassword = 'nostridentitypassword'
export const localStorageKey = 'storens'

export async function encryptAndStorePrivateKey(privateKeyHex) {
    const encoder = new TextEncoder()
    const privateKeyBytes = encoder.encode(privateKeyHex)

    // Derive a key from a password
    const password = encoder.encode(defaultPassword + prompt('Enter a password to secure your newly generated identity, or leave blank for no password:'))
    const keyMaterial = await crypto.subtle.importKey(
        'raw', password, { name: 'PBKDF2' }, false, ['deriveKey']
    )
    
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 1000000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    // Encrypt the private key
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        privateKeyBytes
    )

    // Store encrypted data, salt, and iv in localStorage
    localStorage.setItem(localStorageKey, JSON.stringify({
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted)),
    }))
}

// Function to decrypt the private key from localStorage
export async function decryptPrivateKey() {
    const password = new TextEncoder().encode(defaultPassword + prompt('Enter the same password you originally used:'))

    const keyMaterial = await crypto.subtle.importKey(
        'raw', password, { name: 'PBKDF2' }, false, ['deriveKey']
    )

    const encryptedData = JSON.parse(localStorage.getItem(localStorageKey) || '{}')

    const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: new Uint8Array(encryptedData.salt), iterations: 1000000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.data)
    )

    return new TextDecoder().decode(decrypted)
}
