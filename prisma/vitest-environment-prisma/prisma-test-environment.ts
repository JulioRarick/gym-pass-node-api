import { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    console.log('Setting up prisma environment')

    return {
      teardown() {
        console.log('Tearing down prisma environment')
      },
    }
  },
}
