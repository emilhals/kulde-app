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

export const ParametersPanel = () => {
  const controllerSnap = useSnapshot(controllerState)
  const nodeRef = useRef<HTMLDivElement>({} as any)

  const property = uiState.parametersPanel

  return (
    <Rnd
      default={{
        x: property.x,
        y: property.y,
        width: property.width,
        height: property.height,
      }}
      onDragStop={(_, d) => {
        property.x = d.x
        property.y = d.y
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        property.width = ref.style.width
        property.height = ref.style.height
        property.x = position.x
        property.y = position.y
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
          onClose={() => {
            uiState.activePanel = null
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
