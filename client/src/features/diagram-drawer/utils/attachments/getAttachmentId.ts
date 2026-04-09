import {
    ConnectionAttachment,
    FreeAttachment,
    ItemAttachment,
} from '@/features/diagram-drawer/types'

export const getAttachmentId = (
    attachment: ItemAttachment | ConnectionAttachment | FreeAttachment,
) => {
    switch (attachment.type) {
        case 'item':
            return attachment.itemId
        case 'connection':
            return attachment.connectionId
        case 'free':
            return null
    }
}
