import { useState, useContext } from 'react'

import { Scissors, ArrowLeft, ArrowRight, Type, Trash2, Download, } from 'lucide-react'

import { store } from '@/store'
import { proxy, useSnapshot } from 'valtio'
import { deepClone } from 'valtio/utils'

const Actionbar = () => {

  const snap = useSnapshot(store)

  const handleClick = (clicked: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    store.action = clicked

    switch (clicked) {
      case 'undo':
        console.log('trashed')
        break
      case 'redo':
        console.log('trashed')
        break
      case 'remove':
        console.log("hei")
        console.log(e.currentTarget.id)
        break
      case 'write':
        console.log('trashed')
        break
      case 'trash':
        clearCanvas()
        break
      case 'download':
        console.log('trashed')
        break
    }
  }

  const clearCanvas = () => {
    console.log("deleting canvas")
    const state = proxy(deepClone(store))
    const resetObject = deepClone(store)
    Object.keys(resetObject).forEach((key) => {
      state[key] = resetObject[key]
    })
  }

  return (
    <div className='absolute z-50 flex md:top-8 sm:top-24 justify-center items-center w-full'>
      <div className='flex flex-row w-fit bg-white shadow-md rounded-lg'>
        <div className='flex border-r-2'>
          <button
            onClick={(e) => handleClick('undo', e)}
            className={`px-3 py-3 border-l rounded-tl-lg rounded-bl-lg hover-bg-gray-100`}>
            <ArrowLeft
              className='text-gray-400'
              size={19} />
          </button>

          <button
            onClick={(e) => handleClick('redo', e)}
            className={`px-3 py-3 hover-bg-gray-100`}>
            <ArrowRight
              className='text-gray-400'
              size={19} />
          </button>
        </div>

        <button
          onClick={(e) => handleClick('remove', e)}
          className={`py-3 px-3 hover:bg-gray-100 ${snap.action == 'remove' ? 'bg-gray-50' : ''}`}>
          <Scissors size={19} />
        </button>

        <button
          onClick={(e) => handleClick('write', e)}
          className={`py-3 px-3 hover:bg-gray-100 ${snap.action == 'write' ? 'bg-gray-50' : ''}`}>
          <Type size={19} />
        </button>

        <button
          onClick={(e) => handleClick('trash', e)}
          className={`py-3 px-3 hover:bg-gray-100 ${snap.action == 'trash' ? 'bg-gray-50' : ''}`}>
          <Trash2 size={19} />
        </button>

        <button
          onClick={(e) => handleClick('download', e)}
          className={`py-3 px-3 border-r-2 rounded-tr-lg rounded-br-lg hover:bg-gray-100 ${snap.action == 'download' ? 'bg-gray-50' : ''}`}>
          <Download size={19} />
        </button>
      </div>
    </div>
  )
}

export default Actionbar
