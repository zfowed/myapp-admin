<template>
	<file-explorer :data="explorerData" :windowHeight="config.other.containerHeight"></file-explorer>
</template>

<script>

const FileExplorer = resolve => require(['@/components/FileExplorer'], resolve)

export default {
	name: 'PublicExplorer',
	data () {
		return {
			explorerData: {
				explorerApi: 'core/public/explorer',
				uploadApi: 'core/upload',
				uploadTool: 'core/public/to',
			}
		}
	},
	props: {
		data: { type: Object, required: true },
		config: { type: Object, required: true },
	},
	components: { 'file-explorer': FileExplorer },
}
</script>

<style type="text/css" scoped>

</style>
