<template>
    <div class="display-name-form">
        <div class="input-field">
            <label v-if="showLabel" for="display-name-input">
                Your Display Name
            </label>
            <div class="actions" v-if="editing">
                <input
                    type="text"
                    v-model="displayNameValue"
                    id="display-name-input"
                    placeholder="Enter your name"
                />
                <button class="btn secondary" @click="save">
                    {{ saveLabel }}
                </button>
            </div>
            <div v-else class="inline">
                <span class="name">{{ displayName }}</span>
                <button class="secondary btn small" @click="editing = true">
                    Edit
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Auth from "@web/store/modules/auth/AuthModule";
import Vue from "vue";
import Component from "vue-class-component";
import { Getter } from "vuex-class";
import { Prop, Watch } from "vue-property-decorator";
import Logger from "@shared/Logger";

const logger = new Logger("DisplayNameForm");

@Component
export default class DisplayNameForm extends Vue {
    @Getter(Auth.Getters.displayName) displayName: string | undefined | null;

    @Prop({ type: Boolean, default: false }) showLabel!: boolean;

    @Prop({ type: Boolean, default: false }) alwaysShowSave!: boolean;
    @Prop({ type: String, default: "Save" }) saveLabel!: string;
    displayNameValue = "";

    editing = false;
    beforeMount() {
        this.displayNameValue = this.displayName ?? "";
    }

    get showSaveButton(): boolean {
        return (
            this.displayNameValue !== this.displayName || this.alwaysShowSave
        );
    }

    @Watch("displayName")
    onDisplayNameChanged(name: string) {
        logger.info("Display Name changed to " + name);
        this.displayNameValue = name;
    }

    async save() {
        this.editing = false;
        await this.$store.dispatch(Auth.Actions.setDisplayName, {
            displayName: this.displayNameValue
        });
        this.$emit("saved");
    }
}
</script>

<style lang="scss" scoped>
@import "common";
@import "mixins";
@import "variables";

.display-name-form {
    display: flex;
    .input-field {
        display: flex;
        flex: 1;
        max-width: 100%;
    }

    .name {
        margin-right: spacing($lg);
    }

    .actions {
        display: flex;
        flex: 1;
        input {
            margin-right: spacing($md);
            /*max-width: 20rem;*/
            flex: 1;
            background-color: transparent;

            &:focus,
            &:hover {
                background-color: white;
            }
        }
    }

    .inline {
        display: flex;
        flex: 1;
        align-items: center;

        .name {
            flex: 1;
        }
    }
}
</style>
