import { useEffect, useRef, useState, useCallback } from 'react'
import Peer, { type MediaConnection } from 'peerjs'
import { customAlphabet } from 'nanoid'

const generateId = customAlphabet('0123456789', 6)

export function usePeer() {
  const [myId, setMyId] = useState('')
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isCalling, setIsCalling] = useState(false)

  const peerRef = useRef<Peer | null>(null)
  const callRef = useRef<MediaConnection | null>(null)

  const attachCall = useCallback((call: MediaConnection) => {
    callRef.current = call
    setIsCalling(true)

    call.on('stream', setRemoteStream)
    call.on('close', () => {
      callRef.current = null
      setRemoteStream(null)
      setIsCalling(false)
    })
  }, [])

  useEffect(() => {
    const peer = new Peer(generateId())
    peerRef.current = peer

    peer.on('open', setMyId)

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        peer.on('call', (incomingCall) => {
          incomingCall.answer(stream)
          attachCall(incomingCall)
        })
      })
      .catch((err) => console.error('Cannot access camera/mic:', err))

    return () => {
      peer.destroy()
      peerRef.current = null
    }
  }, [attachCall])

  const callPeer = useCallback(
    (peerId: string) => {
      if (!peerRef.current || !localStream) return
      const outgoingCall = peerRef.current.call(peerId, localStream)
      attachCall(outgoingCall)
    },
    [localStream, attachCall],
  )

  const hangUp = useCallback(() => {
    callRef.current?.close()
    callRef.current = null
    setRemoteStream(null)
    setIsCalling(false)
  }, [])

  return { myId, localStream, remoteStream, isCalling, callPeer, hangUp }
}
