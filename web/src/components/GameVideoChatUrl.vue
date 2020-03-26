<template>
    <div class="video-chat-link-form">
        <div class="input-field">
            <label v-if="showLabel" for="video-chat-input">
                Video Chat
            </label>
            <div class="actions" v-if="editing">
                <input
                    type="text"
                    v-model="url"
                    id="video-chat-input"
                    placeholder="Add a link to a video chat"
                />
                <button class="btn secondary small" @click.prevent="save">
                    {{ doneButtonLabel }}
                </button>
            </div>
            <div v-else class="link-container">
                <a :href="url" target="_blank" class="link">{{
                    "Join the chatroom"
                }}</a>
                <button class="btn secondary small" @click="editing = true">
                    Edit
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Game } from "@shared/models/Game";
import { GamesActions } from "@web/store/modules/games/GamesActions";
import { isBlank } from "@shared/util/ObjectUtil";
import Logger from "@shared/Logger";

const logger = new Logger("VideoChatUrl");

@Component
export default class GameVideoChatUrl extends Vue {
    @Prop({ type: Object as () => Game, required: true }) game!: Game;

    @Prop({ type: Boolean, default: true }) showLabel!: boolean;
    @Prop({ type: Boolean, default: false }) alwaysShowSave!: boolean;
    @Prop({ type: String, default: "Save" }) saveLabel!: string;
    url = "";
    editing = false;

    beforeMount() {
        this.url = this.game.videoChatUrl ?? "";
        this.editing = isBlank(this.url);
    }

    get showSaveButton(): boolean {
        return this.url !== this.game.videoChatUrl || this.alwaysShowSave;
    }

    @Watch("game")
    onValueChanged(game: Game | undefined) {
        this.url = game?.videoChatUrl ?? "";
        this.editing = isBlank(this.url);
    }

    get doneButtonLabel(): string {
        if (isBlank(this.game.videoChatUrl)) {
            return "Add\xa0Link";
        } else {
            return this.saveLabel;
        }
    }

    async save() {
        logger.info("Saved called");
        this.editing = false;

        await this.$store.dispatch(GamesActions.setVideoChatUrl, {
            url: this.url
        });

        this.$emit("saved");
    }
}
</script>

<style lang="scss" scoped>
@import "common";
@import "mixins";
@import "variables";

.video-chat-link-form {
    display: flex;
    .input-field {
        display: flex;
        flex: 1;
        max-width: 100%;
    }
    .actions {
        flex: 1;
        display: flex;
        overflow: hidden;
        align-items: center;
        input {
            margin-right: spacing($md);
            /*max-width: 20rem;*/
            flex: 1;
            min-width: 0;
            background-color: transparent;

            &:focus,
            &:hover {
                background-color: white;
            }
        }
        .btn {
            flex-shrink: 0;
        }
    }

    .link-container {
        display: flex;
        align-items: center;

        .btn {
            /*flex: 1;*/
            /*flex-shrink: 0;*/
        }
        .link {
            margin-right: spacing($lg);
            overflow: hidden;
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
