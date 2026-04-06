import { Connection } from '@/features/diagram-drawer/types'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { diagramHistory } from '../store/models'
import { getAttachmentId } from '../utils/attachments'

export const ShowConnection = ({
    connection,
    source,
}: {
    connection: Connection
    source: string
}) => {
    const fromProxy = diagramHistory.value.items.find(
        (i) => i.id === getAttachmentId(connection.from),
    )
    if (!fromProxy) return null

    const fromTextProxy = diagramHistory.value.texts.find(
        (t) => t.anchor?.itemId === fromProxy.id,
    )

    // to can be both an item and a connection
    const toItemProxy = diagramHistory.value.items.find(
        (i) => i.id === getAttachmentId(connection.to),
    )
    if (!toItemProxy) return null

    const toTextProxy = diagramHistory.value.texts.find(
        (t) => t.anchor?.itemId === toItemProxy.id,
    )

    if (!fromProxy || !toItemProxy) return null
    return (
        <div className="flex flex-row text-xs items-center justify-center ">
            {source === fromProxy.id ? (
                <>
                    {fromTextProxy?.content ? (
                        <p>{fromTextProxy.content}</p>
                    ) : (
                        <p> {fromProxy.component}</p>
                    )}
                    <span className="px-1">
                        <ArrowRight size={16} />
                    </span>
                    {toTextProxy?.content ? (
                        <p>{toTextProxy.content}</p>
                    ) : (
                        <p>{toItemProxy?.component}</p>
                    )}
                </>
            ) : (
                <>
                    {toTextProxy?.content ? (
                        <p>{toTextProxy.content}</p>
                    ) : (
                        <p>{toItemProxy?.component}</p>
                    )}
                    <span className="px-1">
                        <ArrowLeft size={16} />
                    </span>
                    {fromTextProxy?.content ? (
                        <p>{fromTextProxy.content}</p>
                    ) : (
                        <p> {fromProxy.component}</p>
                    )}
                </>
            )}
        </div>
    )
}
