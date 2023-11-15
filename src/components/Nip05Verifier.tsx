import React, { useEffect, useState } from 'react'
import { nip05 } from 'nostr-tools'

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
        // Get the profile for the NIP-05 identifier
        const profile = await nip05.queryProfile(nip05Identifier)

        setVerificationResult({
          verified: profile?.pubkey === pubkey,
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
    <span>
      {nip05Identifier && (
        <>
          <span>{nip05Identifier}</span>
          {verificationResult && verificationResult.verified ? (
            <span style={{ color: 'green', marginLeft: '5px' }}>✓</span>
          ) : (
            <span style={{ color: 'red', marginLeft: '5px' }}>✗</span>
          )}
        </>
      )}
    </span>
  )
}