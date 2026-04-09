import { ItemPreview } from '../types'

const SCALE = 0.7

export const COMPONENTS: ItemPreview[] = [
    {
        component: 'compressor',
        label: 'Compressor',
        width: 96 * SCALE,
        height: 96 * SCALE,
        anchors: {
            position: ['Right', 'Left'],
        },
    },
    {
        component: 'heatexchanger',
        label: 'Heat Exchanger',
        width: 128 * SCALE,
        height: 96 * SCALE,
        anchors: {
            position: ['Right', 'Left'],
        },
    },
    {
        component: 'tev',
        label: 'Thermostatic Expansion Valve',
        width: 156 * SCALE,
        height: 124 * SCALE,
        anchors: {
            position: ['Right', 'Left'],
            offsets: {
                Left: { y: (124 * SCALE) / 2, x: 0 },
                Right: { y: (124 * SCALE) / 2, x: 0 },
            },
        },
    },
    {
        component: 'oilseparator',
        label: 'Oil Separator',
        width: 28 * SCALE,
        height: 64 * SCALE,
        anchors: {
            position: ['Top', 'Bottom', 'Left'],
            offsets: {
                Top: { y: -4, x: 0 },
                Bottom: { y: 4, x: 0 },
                Left: { y: -9, x: -4 },
            },
        },
    },
    {
        component: 'receiver',
        label: 'Receiver',
        width: 56 * SCALE,
        height: 80 * SCALE,
        anchors: { position: ['Top', 'Bottom'] },
    },
    {
        component: 'accumulator',
        label: 'Accumulator',
        width: 56 * SCALE,
        height: 80 * SCALE,
        anchors: { position: ['Top', 'Bottom'] },
    },

    {
        component: 'pressureswitch',
        label: 'Pressure Switch',
        width: 64 * SCALE,
        height: 64 * SCALE,
        anchors: {
            position: ['Bottom'],
        },
    },
    {
        component: 'liquidfilter',
        label: 'Liquid Filter',
        width: 28 * SCALE,
        height: 48 * SCALE,
        anchors: {
            position: ['Top', 'Bottom'],
        },
    },
    {
        component: 'sightglass',
        label: 'Sight Glass',
        width: 20 * SCALE,
        height: 40 * SCALE,
        anchors: {
            position: ['Top', 'Bottom'],
        },
    },
    {
        component: 'solenoidvalve',
        label: 'Solenoid Valve',
        width: 48 * SCALE,
        height: 56 * SCALE,
        anchors: { position: ['Right', 'Left'] },
    },
    {
        component: 'checkvalve',
        label: 'Check Valve',
        width: 44 * SCALE,
        height: 32 * SCALE,
        anchors: { position: ['Right', 'Left'] },
    },
    {
        component: 'ballvalve',
        label: 'Ball Valve',
        width: 44 * SCALE,
        height: 32 * SCALE,
        anchors: { position: ['Right', 'Left'] },
    },
    {
        component: 'pressuregauge',
        label: 'Pressure Gauge',
        width: 36 * SCALE,
        height: 48 * SCALE,
        anchors: { position: ['Bottom'] },
    },
    {
        component: 'thermometer',
        label: 'Thermometer',
        width: 36 * SCALE,
        height: 56 * SCALE,
        anchors: { position: ['Bottom'] },
    },
    {
        component: 'flowmeter',
        label: 'Flow Meter',
        width: 48 * SCALE,
        height: 48 * SCALE,
        anchors: { position: ['Right', 'Left'] },
    },

    {
        component: 'levelindicator',
        label: 'Level Indicator',
        width: 24 * SCALE,
        height: 64 * SCALE,
        anchors: { position: ['Top', 'Bottom'] },
    },
]
