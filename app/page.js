"use client"
import { useRef, useState, useEffect } from 'react'

export default function Home() {
  const voiceRef = useRef()
  const textRef = useRef()
  const [audio, setAudio] = useState(null)// store name of audio file
  const [loading, setLoading] = useState(false)// loading state
  const [voices, setVoices] = useState([]);// store voices

  // handle handleGenerateTTS
  const handleGenerateTTS = async () => {
    const selectedVoice = voiceRef.current.value;
    const text = textRef.current.value;

    
    setLoading(true)
    try {
      if (!text || text.trim() === '') {
        alert("Enter some text")
        return
      }
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          voice: selectedVoice,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong")
      }
      // hold response "file"
      const { file } = await response.json();
      setAudio(file)
      
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // call api to get voices list
    async function getVoices() {
      try {
        const response = await fetch("https://api.elevenlabs.io/v1/voices")
        if (!response.ok) {
          throw new Error("Something went wrong")
        }
        const data = await response.json()
        setVoices(data.voices)
      } catch (error) {
        console.log(error.message)
      }
    }
    getVoices();
   }, [])


  return (
    <main >
      <div className="bg-white py-4 px-4 rounded-md">
        <h3 className='text-2xl font-bold text-blue-800 uppercase mb-6'>ElevenLabs Demo</h3>
        <div className='my-6 flex flex-col gap-4'>
          <div className='flex gap-4 items-center'>
            <label >Select a Voice</label>
            <select ref={voiceRef} className='bg-blue-100 py-2 px-4 rounded-lg'>
              {voices.map((voice) => (
              <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </option>
              ))}
              </select>
          </div>
          {/* input */}
          <textarea ref={textRef} className='py-4 border border-blue-100 rounded-lg outline-none placeholder-gray-400 focus-within:drop-shadow-md'
            placeholder='Say something funny'
            cols={50}
            rows={10}            
          />

          <button
            disabled={loading}
            onClick={handleGenerateTTS}
            className='py-2 px-4 bg-blue-800 text-white rounded-lg hover:opacity-80'
          >
            {loading ? "Generating, please wait" : "Generate TTS"}
          </button>

          {/* audio  */}
          {audio && <audio autoPlay controls src={`audio/${audio}`}  />} 

        </div>
      </div>
      
    </main>
  )
}
