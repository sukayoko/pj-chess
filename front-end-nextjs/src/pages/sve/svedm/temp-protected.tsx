import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import AccessDenied from "components/access-denied"


export default function temp() {
  const { data: session } = useSession()

  // If no session exists, display access denied message
  if (!session) {
    return (
        <AccessDenied />
    )
  }


  // If session exists, display content
  return (
    <div>
        <div>
            {session.user?.name}
        </div>
    </div>
    
  )
}