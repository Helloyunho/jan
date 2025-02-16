import { Fragment } from 'react'

import ScrollToBottom from 'react-scroll-to-bottom'

import { InferenceEngine, MessageStatus } from '@janhq/core'
import { Button } from '@janhq/uikit'
import { useAtomValue } from 'jotai'

import LogoMark from '@/containers/Brand/Logo/Mark'

import GenerateResponse from '@/containers/Loader/GenerateResponse'

import { MainViewState } from '@/constants/screens'

import { activeModelAtom } from '@/hooks/useActiveModel'
import { useGetDownloadedModels } from '@/hooks/useGetDownloadedModels'

import useInference from '@/hooks/useInference'
import { useMainViewState } from '@/hooks/useMainViewState'

import ChatItem from '../ChatItem'

import ErrorMessage from '../ErrorMessage'

import { getCurrentChatMessagesAtom } from '@/helpers/atoms/ChatMessage.atom'

const ChatBody: React.FC = () => {
  const messages = useAtomValue(getCurrentChatMessagesAtom)
  const activeModel = useAtomValue(activeModelAtom)
  const { downloadedModels } = useGetDownloadedModels()
  const { setMainViewState } = useMainViewState()
  const { isGeneratingResponse } = useInference()

  if (downloadedModels.length === 0)
    return (
      <div className="mx-auto flex h-full w-3/4 flex-col items-center justify-center text-center">
        <LogoMark
          className="mx-auto mb-4 animate-wave"
          width={56}
          height={56}
        />
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p className="mt-1 text-base">You need to download your first model</p>
        <Button
          className="mt-4"
          onClick={() => setMainViewState(MainViewState.Hub)}
        >
          Explore The Hub
        </Button>
      </div>
    )

  const showOnboardingStep =
    downloadedModels.filter((e) => e.engine === InferenceEngine.nitro)
      .length === 0

  return (
    <Fragment>
      {messages.length === 0 ? (
        <div className="mx-auto flex h-full w-3/4 flex-col items-center justify-center text-center">
          <LogoMark
            className="mx-auto mb-4 animate-wave"
            width={56}
            height={56}
          />
          {showOnboardingStep ? (
            <>
              <p className="mt-1 text-base font-medium">
                {`You don't have a local model yet.`}
              </p>
              <div className="w-auto px-4 py-2">
                <Button
                  block
                  className="bg-blue-100 font-bold text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                  onClick={() => setMainViewState(MainViewState.Hub)}
                >
                  Explore The Hub
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-1 text-base font-medium">How can I help you?</p>
          )}
        </div>
      ) : (
        <ScrollToBottom className="flex h-full w-full flex-col">
          {messages.map((message, index) => (
            <div key={message.id}>
              {(message.status !== MessageStatus.Pending ||
                message.content.length > 0) && (
                <ChatItem {...message} key={message.id} />
              )}
              {(message.status === MessageStatus.Error ||
                message.status === MessageStatus.Stopped) &&
                index === messages.length - 1 && (
                  <ErrorMessage message={message} />
                )}
            </div>
          ))}

          {activeModel &&
            (isGeneratingResponse ||
              (messages.length &&
                messages[messages.length - 1].status ===
                  MessageStatus.Pending &&
                !messages[messages.length - 1].content.length)) && (
              <GenerateResponse />
            )}
        </ScrollToBottom>
      )}
    </Fragment>
  )
}

export default ChatBody
