<template>
    <div class="link-input-container">
        <span class="game-link" ref="linkInput">{{ gameUrl }}</span>
        <button
            class="btn small"
            :class="{
                'primary light': copyAlert != null,
                secondary: copyAlert == null
            }"
            @click="copyLink"
        >
            {{ copyAlert !== null ? copyAlert.message : "Copy Link " }}
        </button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AlertMessage } from "@web/util/AlertMessage";
import Logger from "@shared/Logger";
import AnalyticsService from "@web/services/AnalyticsService";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";

const logger = new Logger("InvitePlayers");
export default Vue.extend({
    name: "InvitePlayers",
    data(): {
        copyAlert: AlertMessage | null;
        copyAlertTimeout: number | null;
    } {
        return {
            copyAlert: null,
            copyAlertTimeout: null
        };
    },
    computed: {
        gameUrl(): string {
            return window.location.href;
        }
    },
    methods: {
        showCopySuccessAlert() {
            this.copyAlert = AlertMessage.info("Link copied");
            if (this.copyAlertTimeout) {
                clearInterval(this.copyAlertTimeout);
            }
            this.copyAlertTimeout = setTimeout(() => {
                this.copyAlert = null;
                if (this.copyAlertTimeout) {
                    clearInterval(this.copyAlertTimeout);
                }
            }, 2500);
        },
        copyLink(): void {
            const range = document.createRange();
            const node = this.$refs.linkInput as Element;
            if (!node) {
                return;
            }
            window.getSelection()?.removeAllRanges();
            range.selectNode(node);
            window.getSelection()?.addRange(range);
            try {
                const success = document.execCommand("copy");
                if (success) {
                    logger.info("Copied text to clipboard");
                    const game = this.$store.getters[GamesGetters.currentGame];
                    if (game) {
                        AnalyticsService.shared.copyGameLink(game);
                    }
                    this.showCopySuccessAlert();
                } else {
                    logger.warn("unable to copy text");
                }
            } catch (error) {
                logger.error("Failed to copy text");
            } finally {
                window.getSelection()?.removeAllRanges();
            }
        }
    }
});
</script>

<style scoped lang="scss">
@import "mixins";

.link-container {
    border: 1px solid rgba(color($color-shadow), 0.3);
    overflow: hidden;

    @include rounded($cornerRadiusXl);
    padding-right: spacing($md);
    background-color: color($color-background, $variant-light);

    .inner {
        overflow: auto;
        margin: 0;
        @include container($md);
    }
}

.link-input-container {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 3rem;
    border: 1px solid color($color-primary, $variant-base);

    //@include container($md);
    padding-right: 4rem;

    .link-input {
        display: none;
        border-radius: 3rem;
        @include container($md);
        padding-right: 6rem;
        min-width: 0;
        flex: 1;
        @include font($xs);
    }

    .btn {
        position: absolute;
        right: 3px;
        border-radius: 3rem;
        height: calc(100% - 6px);
    }

    .game-link {
        overflow: auto;
        @include font($sm);
        @include container($md);
        margin-right: 4rem;
    }
}
</style>
