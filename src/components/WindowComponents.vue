<template>
	<window-template :list="list" ref="windowTemplate">
		<template scope="props">
			<div
				:is="props.config.is"
				:ref="props.config.ref"
				:data="props.data"
				:config="props.config"
				@open="onOpen"
				@emit="onEmit"
				@close="onClose"
			></div>
		</template>
	</window-template>
</template>

<script>

import { WindowTemplate } from '@/components/Window'
import WindowComponents from './WindowComponents'


let components = { "window-template": WindowTemplate };
for ( let key in WindowComponents ) {
	components[key] = WindowComponents[key].component;
}



export default {
	name: 'WindowComponents',
	data () {
		return { }
	},
	components: components,
	props: {
		list: { type: Array, default () { return []; } },
	},
	methods: {
		onOpen (is, ...params) {

			const windowComponents = WindowComponents[is];
			if (!windowComponents) { return ; }

			let mark, ref, config, data;
			if (windowComponents.only) {
				ref = is;
				data = Object.assign({}, windowComponents.data, params[0] || {});
				config = Object.assign({}, windowComponents.config , params[1] || {});
			} else {
				mark = params[0];
				ref = JSON.stringify({is, mark});
				data = Object.assign({}, windowComponents.data, params[1] || {});
				config = Object.assign({}, windowComponents.config , params[2] || {});
			}

			config.is = is;
			config.mark = mark;
			config.ref = ref;

			if (this.$refs[config.ref]) {
				const index = this.list.findIndex(item=>item.config.ref===config.ref);
				return this.$refs.windowTemplate.onTop(index);
			}

			if (!config.top) {
				config.top = this.random(0, this.$el.offsetHeight - (config.height || 300));
			}
			if (!config.left) {
				config.left = this.random(0, this.$el.offsetWidth - (config.width || 400));
			}

			this.$refs.windowTemplate.onOpen(config, data);
		},
		onEmit (is, parameter) {
			let { mark, event, params } = parameter;

			const ref = mark ? JSON.stringify({is, mark }) : is;
			params = params || [];

			if (this.$refs[ref]) {
				this.$refs[ref].$emit(event, ...params);
			}

		},
		onClose (is, mark) {

			const ref = mark ? JSON.stringify({is, mark }) : is;
			const itemIndex = this.list.findIndex(item=>item.config.ref===ref);
			if (this.$refs[ref] && itemIndex >= 0) {
				this.list.splice(itemIndex, 1);
			}

		},
		onCloseAll (cd) {
			this.list.splice(0, this.list.length);
			cd && cd();
		},
		random (min,max){
			return Math.floor(min + Math.random() * ( max - min ));
		}
	},
	created () {

	}
}
</script>