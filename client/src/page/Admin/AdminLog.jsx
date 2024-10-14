import axios from 'axios'
import { useState, useEffect } from 'react'

const AdminLog = () => {
    // eslint-disable-next-line no-unused-vars
    const [logs, setLogs] = useState([])

    // useEffect(() => {
    //     async function getLogs() {
    //         try {
    //             const res = await axios.get('api/v1/admin/log', {
    //                 headers: {
    //                     'admintoken': 'loduchand'
    //                 }
    //             })
    //             setLogs(res.data)
    //             console.log(res)
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     getLogs()
    // }, [])

    return (
        <>
            <div className=' flex justify-center items-center  min-h-screen bg-gradient-to-b from-gray-900 to-blue-900'>
               <h1 className='text-4xl text-white'>Under Progress</h1>
            </div>
        </>
    )
}

export default AdminLog
