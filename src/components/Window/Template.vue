<template>
	<div :class="['window-template', {'window-fixed': fixed}]">
		<transition-group name="fade" tag="div">
			<window-single
				v-for="(item, index) in windowList"
				:config="item.config"
				:data="item.data"
				:fixed="fixed"
				:key="item.ref || index"
				@close="onClose(item, index)"
				@focus="onFocus(item, index)"
			>
				<template scope="props">
					<slot :data="props.data" :config="props.config"></slot>
				</template>
			</window-single>
		</transition-group>
	</div>
</template>

<script>

import WindowSingle from './Single.vue'

export default {
	name: 'WindowTemplate',
	data () {
		return {
			zIndex: 2017,
		}
	},
	props: {
		zIndexDefault: { type: Number },
		list: { type: Array, required: true },
		fixed: { type: Boolean, default: false },
	},
	computed: {
		windowList () {
			return this.list.filter(item=>typeof item === 'object'&&typeof item.config === 'object'&&typeof item.data === 'object');
		}
	},
	methods: {
		onOpen (config, data) {
			config.zIndex = this.zIndex++;
			this.list.push({ config, data });
		},
		onFocus (item, index) {
			const focuWindow = this.list.find((findItem, i)=>i!==index&&findItem.config.focus);
			if (focuWindow) { focuWindow.config.focus = false; }

			if (item.config.currentStatus === 'hide') { item.config.currentStatus = ''; }

			item.config.zIndex = this.zIndex++;
			item.config.focus = true;
		},
		onClose (item, index) {
			this.list.splice(index, 1);

			this.$emit('close', item);
		},
		onTop (index) {
			if (typeof index !== 'number' || index < 0 || !this.list[index]) { return ; }
			this.onFocus(this.list[index], index);
		}
	},
	components: {
		"window-single": WindowSingle
	},
	created () {
		if (this.zIndexDefault > 0) {
			this.zIndex = this.zIndexDefault;
		}
		this.$on('open', this.onOpen);
		this.$on('top', this.onTop);
	}
}
</script>

<style type="text/css" scoped>
	.window-template {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.window-template.window-fixed {
		width: 100%;
		height: 100%;
		overflow: inherit;
	}

	.window-template > div {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .4s
	}
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}

</style>