<template>
    <div class="phase">
        <div v-if="phase === Phase.SETUP" class="description">
            <h3 class="title">Welcome to <span class="logo">FishBowl</span></h3>
            <p>
                First, enter some words into the fishbowl. These words will be
                used through out the game.
            </p>

            <p>
                <span>Invite friends by sending them this link:</span>
            </p>
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

            <p>
                The game will start once everyone has pressed their
                ready&nbsp;button
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Phase } from "@shared/models/Game";
import Logger from "@shared/Logger";
import { AlertMessage } from "@web/util/AlertMessage";

const logger = new Logger("GamePhase");

export default Vue.extend({
    components: {},
    props: {
        phase: { type: Number as () => Phase, default: Phase.SETUP }
    },
    filters: {
        trim(input?: string | undefined): string | undefined {
            return input?.trim();
        }
    },
    destroyed(): void {
        if (this.copyAlertTimeout) {
            clearTimeout(this.copyAlertTimeout);
        }
    },
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
        // eslint-disable-next-line vue/return-in-computed-property
        title(): string {
            switch (this.phase) {
                case Phase.SETUP:
                    return "Welcome to Fish Bowl!";
                case Phase.IN_PROGRESS:
                    return "";
                case Phase.FINISHED:
                    return "";
            }
        },
        gameUrl(): string {
            return window.location.href;
        },
        Phase(): object {
            return Phase;
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

.logo {
    @include logo;
}

.phase {
    width: 100%;
    overflow: hidden;
}

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

    @include container($md);
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
    }
}
</style>
