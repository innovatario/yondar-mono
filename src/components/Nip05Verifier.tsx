import React, { useEffect, useState } from 'react'

interface VerificationResult {
  verified: boolean;
  nip05Identifier: string | null | undefined;
}

interface Nip05VerifierProps {
  pubkey: string | null | undefined;
  nip05Identifier: string | null | undefined;
}

export const Nip05Verifier: React.FC<Nip05VerifierProps> = ({ pubkey, nip05Identifier }) => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    const verifyNip05 = async () => {
      try {
        if(!nip05Identifier){
           return setVerificationResult({
                verified: false,
                nip05Identifier,
              })
        }
        const [localPart, domain] = nip05Identifier.split('@')

        const apiUrl = localPart === '_'
          ? `https://${domain}/.well-known/nostr.json?name=_`
          : `https://${domain}/.well-known/nostr.json`

        const response = await fetch(apiUrl)
        const data = await response.json()

        // Check if the pubkey matches the one in the response
        const verified = data.names && data.names[localPart] === pubkey

        setVerificationResult({
          verified,
          nip05Identifier,
        })
      }catch(e) {
        console.log(e)
        setVerificationResult({
          verified: false,
          nip05Identifier,
        })
      }
    }

    verifyNip05()
  }, [pubkey, nip05Identifier])

  return (
    <div>
      <span>{nip05Identifier}</span>
      {verificationResult && verificationResult.verified && (
        <span style={{ color: 'green', marginLeft: '5px' }}>✓</span>
      )}
    </div>
  )
}