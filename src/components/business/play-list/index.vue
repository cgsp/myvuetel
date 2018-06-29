<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <!-- iconMode是mixin中的 -->
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="confirmShow">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" :refreshDelay="refreshDelay" ref="scroll" :startY="startY">
          <!-- transition-group  tag="ul"，是让这个节点渲染成ul -->
          <!-- transition-group  transition-group的子元素，必须有个key来区分， 本例中可以用item.id来区分 -->
          <transition-group tag="ul" name="list">
            <li class="item" v-for="(item, index) in sequenceList" :key="index" @click="selectItem(item, index,$event)">
              <i class="current" :class="getCurrentSong(item, index)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavotite(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSongShow">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
        <confirm ref="confirm" text="确定清空吗" @confirm="clearConfirm"></confirm>
        <add-song ref="addSong"></add-song>
      </div>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import Scroll from '@VBase/scroll';
import Confirm from '@VBase/confirm';
import AddSong from '@VBusiness/add-song';
import { mapActions } from 'vuex';
// 放到mixin中
// import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from '@js/config';
import { playerMixin } from '@js/mixin';
export default {
  name: 'PlayList',
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      startY: 0,
      index: 0,
      refreshDelay: 600
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.random ? '随机播放' : '单曲循环';
    }
    // 放到mixin
    // ...mapGetters(['sequenceList', 'currentSong', 'playList', 'mode'])
  },
  methods: {
    addSongShow() {
      this.$refs.addSong.show();
    },
    confirmShow() {
      this.$refs.confirm.show();
    },
    clearConfirm() {
      this.clearSongList();
      this.hide();
    },
    deleteOne(song) {
      this.deleteSong(song);
      if (!this.playList.length) {
        this.hide();
      }
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
        const me = this;
        this.$refs.scroll.scrollTo(0, -40 * me.index, 0);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentSong(item, index) {
      if (item.id === this.currentSong.id) {
        this.index = index;
        return 'icon-play';
      }
      return '';
    },
    selectItem(item, index, $event) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id;
        });
      }

      this.$refs.scroll.scrollTo(0, -40 * index, 500);

      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    // 放到mixin中
    // ...mapMutations({
    //   setCurrentIndex: 'SET_CURREENT_INDEX',
    //   setPlayingState: 'SET_PLAYING_STATE'
    // }),
    ...mapActions(['deleteSong', 'clearSongList'])
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.8s;
  opacity: 1;
  .list-wrapper {
    transition: all 0.8s;
  }
}
.list-fade-enter,
.list-fade-leave-to {
  opacity: 0;
  .list-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}

.play-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.5);
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    background-color: $color-highlight-background;
    .list-header {
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: #ffcd32;
          line-height: 30px;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 350px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.2s linear;
        }
        &.list-enter,
        &.list-leave-to {
          transform: translate3d(100%, -100%, 0) scale(3);
          // color: #ffcd32;
          // height: 0;
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $color-theme-d;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .like {
          @include extend-click();
          display: inline-block;
          padding: 1px;
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-not-favorite {
            color: #ffcd32;
          }
          .icon-favorite {
            color: red;
          }
        }
        .delete {
          @include extend-click();
          display: inline-block;
          padding: 1px;
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
