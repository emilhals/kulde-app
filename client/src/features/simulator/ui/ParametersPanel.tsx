import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/shared/ui/table'
import { useRef } from 'react'
import { Rnd } from 'react-rnd'
import { useSnapshot } from 'valtio'
import { controllerState } from '../stores/controller'
import { uiState } from '../stores/ui'
import { FloatingPanelHeader } from './FloatingPanelHeader'
import {
  resizePanel,
  setActivePanel,
  setPanelPosition,
  togglePin,
} from '../stores/ui.actions'

export const ParametersPanel = () => {
  const controllerSnap = useSnapshot(controllerState)
  const uiSnap = useSnapshot(uiState)

  const panel = uiSnap.panels.parameters

  const nodeRef = useRef<HTMLDivElement>({} as any)

  return (
    <Rnd
      size={{ width: panel.width, height: panel.height }}
      position={{ x: panel.x, y: panel.y }}
      onDragStop={(_, d) => {
        setPanelPosition('parameters', { x: d.x, y: d.y })
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        const { width, height } = ref.style

        resizePanel(
          'parameters',
          { width: width, height: height },
          { x: position.x, y: position.y },
        )
      }}
      bounds="#container"
      dragHandleClassName="parameters-drag-handle"
      className="z-50"
    >
      <div
        ref={nodeRef}
        className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-lg"
      >
        <FloatingPanelHeader
          dragHandleClassName="parameters-drag-handle"
          title="parameters"
          isPinned={uiSnap.panels.parameters.isPinned}
          onPin={() => {
            togglePin('parameters')
          }}
          onClose={() => {
            setActivePanel(null)
          }}
        />

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
          <Table noWrapper className="table-auto">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-0 whitespace-nowrap">
                  Parameter
                </TableHead>

                <TableHead>Function</TableHead>

                <TableHead className="w-px whitespace-nowrap text-right">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.entries(controllerSnap.parameters).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="w-0 whitespace-nowrap font-mono font-medium">
                    {key}
                  </TableCell>
                  <TableCell>{value.function}</TableCell>
                  <TableCell className="mr-3 text-right">
                    {value.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Rnd>
  )
}
