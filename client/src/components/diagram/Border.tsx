import { Line, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { Anchor } from '@/components/diagram/Anchor';

import { ItemType, PointType } from '@/common/types';

import { settingsState } from '@/stores/settingsStore';
import { useSnapshot } from 'valtio';

export type AnchorType = PointType & {
  name: string;
};

const getAnchorPoints = (item: ItemType) => {
  const anchors: AnchorType[] = [];

  item.anchors.map((placement) => {
    if (placement === 'Top') {
      anchors.push({
        name: 'top',
        x: item.x + item.width / 2,
        y: item.y,
      })
    }
    if (placement === 'Bottom') {
      anchors.push({
        name: 'bottom',
        x: item.x + item.width / 2,
        y: item.y + item.height
      })
    }

    if (placement === 'Left') {
      anchors.push({
        name: 'left',
        x: item.x,
        y: item.y + item.height / 2
      })
    }

    if (placement === 'Right') {
      anchors.push({
        name: 'right',
        x: item.x + item.width,
        y: item.y + item.height / 2,
      })
    }
  })

  return anchors;
}

type BorderProps = {
  item: ItemType
  hovered: string
  onAnchorDragStart: (e: KonvaEventObject<DragEvent>, id: string | number) => void
  onAnchorDragMove: (e: KonvaEventObject<DragEvent>, id: string | number) => void
  onAnchorDragEnd: (e: KonvaEventObject<DragEvent>, id: string | number) => void
}

export const Border = ({ item, hovered, onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd }: BorderProps) => {
  const snap = useSnapshot(settingsState);

  if (!item) return;

  const anchorPoints = getAnchorPoints(item);
  const points = [0, 0, item.width, 0, item.width, item.height, 0, item.height, 0, 0];

   const anchors = anchorPoints.map(({ x, y, name }) => (
    <Anchor
      key={`anchor-${name}`}
      id={name}
      x={x}
      y={y}
      hovered={hovered}
      onDragStart={onAnchorDragStart}
      onDragMove={onAnchorDragMove}
      onDragEnd={onAnchorDragEnd}
    />
  ));

  return (
    <Group>
      {item ? (
        <Line
          x={item.x}
          y={item.y}
          points={points}
          stroke={snap.isDarkMode ? snap.darkAccentColor : snap.lightAccentColor}
          strokeWidth={2}
          listening={false}
          perfectDrawEnabled={false}
        />
      ) : null}
      {anchors}
    </Group>
  )
}

