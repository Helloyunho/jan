import React, { Fragment, useCallback } from 'react'

import { Button } from '@janhq/uikit'

import LogoMark from '@/containers/Brand/Logo/Mark'

import { MainViewState } from '@/constants/screens'

import { useGetDownloadedModels } from '@/hooks/useGetDownloadedModels'
import { useMainViewState } from '@/hooks/useMainViewState'

const RequestDownloadModel: React.FC = () => {
  const { downloadedModels } = useGetDownloadedModels()
  const { setMainViewState } = useMainViewState()

  const onClick = useCallback(() => {
    setMainViewState(MainViewState.Hub)
  }, [setMainViewState])

  return (
    <div className="mx-auto mt-8 flex h-full w-3/4 flex-col items-center justify-center text-center">
      {downloadedModels.length === 0 && (
        <Fragment>
          <LogoMark
            className="mx-auto mb-4 animate-wave"
            width={56}
            height={56}
          />
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <p className="mt-1 text-base">
            You need to download your first model
          </p>
          <Button className="mt-4" onClick={onClick}>
            Explore The Hub
          </Button>
        </Fragment>
      )}
    </div>
  )
}

export default React.memo(RequestDownloadModel)
