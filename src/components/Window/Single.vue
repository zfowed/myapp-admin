<template>
	<div
		v-show="show"
		unselectable="on"
		:class="['window-single', {'window-fixed': fixed, 'window-focus': config.focus }, statusClass, eventClass]"
		:style="singleStyle"
		@mousedown="singleMousedown"
	>
		<div class="header"  ondragstart='return false;' onselectstart='return false;'>
			<div v-show="config.icon" class="icon">
				<img :src="config.icon" alt="icon">
			</div>
			<div class="title" @mousedown="headerMousedown">{{title}}</div>
			<div class="btns">
				<div class="button button-hide" @click="onHide">－</div>
				<div class="button button-window" v-show="config.currentStatus==='full'" @click="onWindow">⊙</div>
				<div class="button button-full" v-show="config.currentStatus!=='full'" @click="onFull">⊙</div>
				<div class="button button-close" @click="onClose">✘</div>
			</div>
		</div>
		<div class="container" :style="containerStyle">
			<slot :config="config" :data="data"></slot>
		</div>
		<div class="footer">
			<div class="resize" v-show="config.currentStatus!=='full'" @mousedown="resizeMousedown" ></div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'WindowSingle',
	data () {
		return {
			aaaa: true,
			headerStyleData: {
				height: 35,
			},
			eventData: {
				mousedownX: 0,
				mousedownY: 0,
				mousemoveX: 0,
				mousemoveY: 0,
			},
			parentNodeSize: {
				width: 0,
				height: 0,
			},
		};
	},
	props: {
		data: { type: Object },
		config: { type: Object, required: true },
		fixed: { type: Boolean, default: false },
	},
	computed: {
		show () {

			// if (this.parentNodeSize.width < this.config.width || this.parentNodeSize.height < this.config.height) {
			// 	return false;
			// }

			if (this.config.currentStatus === 'hide' || this.config.currentStatus === 'close') {
				return false;
			}

			return true;
		},
		options () {
			return Object.assign({}, this.defaultOptions, this.config);
		},
		title () {
			const title = this.config.title.replace(/\${([^}]+?)}/g, (all, key) => {
				return this.data[key].toString() || '';
			});
			this.config.other.title = title;
			return title;
		},
		showSingleStyleData () {

			if (this.config.currentStatus === 'full') {
				return {
					width: this.parentNodeSize.width,
					height: this.parentNodeSize.height,
					top: 0,
					left: 0,
					zIndex: this.config.zIndex,
				}
			} else if (this.config.currentStatus === 'hide') {
				return {
					width: 0,
					height: 0,
					top: this.parentNodeSize.height / 2,
					left: this.parentNodeSize.width / 2,
					zIndex: this.config.zIndex,
				}
			}

			if (this.config.currentEvent === 'move') {


				let left = this.config.left + this.eventData.mousemoveX;
				let top = this.config.top + this.eventData.mousemoveY;

				if (left < 0) {
					left = 0;
				} else if (left > this.parentNodeSize.width - this.config.width) {
					left = this.parentNodeSize.width - this.config.width;
				}
				if (top < 0) {
					top = 0;
				} else if (top > this.parentNodeSize.height - this.config.height) {
					top = this.parentNodeSize.height - this.config.height;
				}


				return Object.assign({}, this.config, { left, top });
			} else if (this.config.currentEvent === 'resize') {

				let width = this.config.width + this.eventData.mousemoveX;
				let height = this.config.height + this.eventData.mousemoveY;

				if (width <= 400) {
					width = 400;
				}
				if (height <= 300) {
					height = 300;
				}

				return Object.assign({}, this.config, { width, height });

			}

			return this.config;
		},
		singleStyle () {
			return {
				width: this.showSingleStyleData.width + 'px',
				height: this.showSingleStyleData.height + 'px',
				top: this.showSingleStyleData.top + 'px',
				left: this.showSingleStyleData.left + 'px',
				'z-index': this.showSingleStyleData.zIndex,
			}
		},
		containerStyle () {
			const headerHeight = this.headerStyleData.height || 0;
			const containerHeight = this.showSingleStyleData.height - headerHeight;

			this.config.other.containerHeight = containerHeight;
			return {
				height: containerHeight + 'px',
			}
		},
		statusClass () {
			if (this.config.currentStatus) {
				return `status-${this.config.currentStatus}`
			} else {
				return '';
			}
		},
		eventClass () {
			return this.config.currentEvent ? `event-${this.config.currentEvent}` : '';
		},
	},
	methods: {
		updateParentNodeSize () {
			if (this.fixed) {
				Object.assign(this.parentNodeSize, {
					width: window.innerWidth,
					height: window.innerHeight,
				});
			} else {
				Object.assign(this.parentNodeSize, {
					width: this.$el.parentNode.offsetWidth,
					height: this.$el.parentNode.offsetHeight,
				});
			}

			if (!this.show) { return ; }

			if (this.config.left < 0) {
				this.config.left = 0;
			} else if (this.config.left > this.parentNodeSize.width - this.config.width) {
				this.config.left = this.parentNodeSize.width - this.config.width;
			}
			if (this.config.top < 0) {
				this.config.top = 0;
			} else if (this.config.top > this.parentNodeSize.height - this.config.height) {
				this.config.top = this.parentNodeSize.height - this.config.height;
			}
		},
		updateHeaderHeight () {
			setTimeout(()=>{
				const headerEl = this.$el.querySelector('.header');
				this.headerStyleData.height = headerEl.offsetHeight;
				if (this.headerStyleData.height <= 0) {
					return this.updateHeaderHeight();
				}
				this.config.other.headerHeight = this.headerStyleData.height;
			}, 10);
		},
		singleMousedown (event) {
			if (!this.config.focus) {
				this.config.focus = true;
				this.$emit('focus');
			}
			if (this.config.currentEvent) {
				this.eventData.mousedownX = event.clientX;
				this.eventData.mousedownY = event.clientY;
			}
		},
		documentMousemove (event) {
			if (this.config.currentEvent === '') { return ; }
			this.eventData.mousemoveX = event.clientX - this.eventData.mousedownX;
			this.eventData.mousemoveY = event.clientY - this.eventData.mousedownY;
		},
		documentMouseup (event) {
			if (this.config.currentEvent === '') { return ; }
			Object.assign(this.config, this.showSingleStyleData);
			this.config.currentEvent = '';
			this.eventData.mousemoveX = 0;
			this.eventData.mousemoveY = 0;
		},
		headerMousedown (event) {
			if (this.config.currentStatus !== 'full' && this.config.currentStatus !== 'hide') {
				this.config.currentEvent = 'move';
			}
		},
		resizeMousedown (event) {
			if (this.config.currentStatus !== 'full' && this.config.currentStatus !== 'hide') {
				this.config.currentEvent = 'resize';
			}
		},
		onHide (event) {
			this.config.currentStatus = 'hide';
			this.config.focus = false;
			this.$emit('status', 'hide');
		},
		onFull () {
			this.config.currentStatus = 'full'
			this.$emit('status', 'full');
		},
		onWindow () {
			this.config.currentStatus = '';
			this.$emit('status', 'window');
		},
		onClose (event) {
			this.config.currentStatus = 'close';
			this.config.focus = false;
			this.$emit('close');
		},
	},
	created () {
		if (typeof this.config.currentStatus === 'undefined') {
			this.$set(this.config, 'currentStatus', '');
		}
		if (typeof this.config.currentEvent === 'undefined') {
			this.$set(this.config, 'currentEvent', '');
		}
		if (typeof this.config.icon === 'undefined') {
			this.$set(this.config, 'icon', '');
		}
		if (typeof this.config.title === 'undefined') {
			this.$set(this.config, 'title', '窗口');
		}
		if (typeof this.config.width === 'undefined') {
			this.$set(this.config, 'width', 400);
		}
		if (typeof this.config.height === 'undefined') {
			this.$set(this.config, 'height', 300);
		}
		if (typeof this.config.top === 'undefined') {
			this.$set(this.config, 'top', 100);
		}
		if (typeof this.config.left === 'undefined') {
			this.$set(this.config, 'left', 100);
		}
		if (typeof this.config.zIndex === 'undefined') {
			this.$set(this.config, 'zIndex', 2017);
		}
		if (typeof this.config.focus === 'undefined') {
			this.$set(this.config, 'focus', true);
		}
		this.$set(this.config, 'other', {
			title: this.config.title,
			headerHeight: 35,
			containerHeight: this.config.height - 35,
		});
	},
	mounted () {

		window.addEventListener('resize', this.updateParentNodeSize);
		document.addEventListener('mousemove', this.documentMousemove);
		document.addEventListener('mouseup', this.documentMouseup);

		this.updateParentNodeSize();
		this.updateHeaderHeight();

		if (this.config.focus) {
			this.$emit('focus');
		}

	},
	destroyed () {
		window.removeEventListener('resize', this.updateParentNodeSize);
		document.removeEventListener('mousemove', this.documentMousemove);
		document.removeEventListener('mouseup', this.documentMouseup);
	}
};

</script>

<style type="text/css" scoped>
	.window-single {
		position: absolute;
		background-color: #fff;
		box-shadow: 0 0 5px #222;
	}

	.window-single.window-fixed {
		position: fixed;
	}

	.window-single.event-resize,
	.window-single.event-move {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.window-single > .header {
		position: relative;
		width: 100%;
		overflow: hidden;
		cursor: default;
		height: 35px;
		line-height: 35px;
		border-bottom: solid 1px #999;
		background-color: #fff;
	}

	.window-single > .header > .icon {
		overflow: hidden;
		float: left;
		height: 100%;
		text-align: center;
		margin: 0 5px;
		overflow: hidden;
	}
	.window-single > .header > .icon > img {
		height: 80%;
		margin: 10% 0;
		display: block;
	}

	.window-single > .header > .title {
		white-space: nowrap;
		margin-left: 10px;
	}
	.window-single > .header > .btns {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
	}
	.window-single > .header > .btns > .button {
		float: left;
		text-align: center;
		cursor: pointer;
		width: 35px;
		background-color: #fff;
	}
	.window-single > .header > .btns > .button:hover {
		background-color: #ddd;
	}

	.window-single > .container {
		position: relative;
		width: 100%;
		overflow: auto;
	}
	.window-single > .footer > .resize {
		position: absolute;
		bottom: -5px;
		right: -5px;
		width: 10px;
		height: 10px;
		cursor: se-resize;
	}

	.single-fade-enter-active,
	.single-fade-leave-active {
		transition: opacity .4s
	}
	.single-fade-enter,
	.single-fade-leave-active {
		opacity: 0
	}

</style>


<style type="text/css" scoped>

	.window-single.window-focus {
		box-shadow: 0 0 5px #20a0ff;
	}
	
	.window-single.window-focus > .header{
		background-color: #20a0ff;
	}
	.window-single.window-focus > .header > .btns > .button {
		background-color: #20a0ff;
	}
	.window-single.window-focus > .header > .btns > .button:hover {
		background-color: rgba(0,0,0,0.1);
	}


	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
	[scrollbar]::-webkit-scrollbar {
		width: 10px;
		height: 10px;
		background-color: #F5F5F5;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	[scrollbar]::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
		/*border-radius: 5px;*/
		background-color: #F5F5F5;
	}

	/*定义滑块 内阴影+圆角*/  
	[scrollbar]::-webkit-scrollbar-thumb {
		/*border-radius: 5px;*/
		-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.3);
		background-color: #555;
	}
</style>