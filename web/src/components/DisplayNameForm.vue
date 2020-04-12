<template>
    <div class="display-name-form">
        <div class="input-field">
            <label v-if="showLabel" for="display-name-input" class="name-label">
                My Name
            </label>
            <div class="actions" v-if="editing">
                <div class="inputs">
                    <input type="text" v-model="displayNameValue" id="display-name-input" placeholder="Enter your name" />

                    <label v-if="showTeamName">
                        Team
                        <select v-model="selectedTeam">
                            <option v-for="team in teamOptions" :key="team.value" :value="team.value">{{ team.displayName }}</option>
                        </select>
                    </label>
                </div>
                <div class="action-buttons">
                    <button class="btn secondary" @click="save">
                        {{ saveLabel }}
                    </button>
                    <button class="btn link" @click="editing = false" v-if="showCancel">
                        Cancel
                    </button>
                </div>
            </div>
            <div v-else class="inline">
                <span class="name">{{ displayName }}</span>
                <button class="secondary btn small" @click="editing = true">
                    Edit
                </button>
            </div>
        </div>
        <div v-if="!editing && showTeamName && player && player.team !== undefined">Team {{ player.team + 1 }}</div>
    </div>
</template>

<script lang="ts">
import Auth from "@web/store/modules/auth/AuthModule";
import GameStore from "@web/store/modules/games/GamesModule";
import Vue from "vue";
import Component from "vue-class-component";
import { Getter } from "vuex-class";
import { Prop, Watch } from "vue-property-decorator";
import Logger from "@shared/Logger";
import Player from "@shared/models/Player";
import { isBlank } from "@shared/util/ObjectUtil";
import { Game } from "@shared/models/Game";

const logger = new Logger("DisplayNameForm");

@Component
export default class DisplayNameForm extends Vue {
    @Getter(Auth.Getters.displayName) displayName: string | undefined | null;
    @Getter(GameStore.Getters.currentPlayer) player: Player | undefined | null;
    @Getter(GameStore.Getters.currentGame) game: Game | undefined | null;
    @Prop({ type: Boolean, default: false }) showLabel!: boolean;
    @Prop({ type: Boolean, default: true }) showTeamName!: boolean;
    @Prop({ type: Boolean, default: false }) alwaysShowSave!: boolean;
    @Prop({ type: String, default: "Save" }) saveLabel!: string;
    @Prop({ type: Boolean, default: true }) showCancel!: boolean;

    displayNameValue = "";
    editing = false;

    selectedTeam: string | undefined | null = null;

    beforeMount() {
        this.displayNameValue = this.displayName ?? "";
        if (isBlank(this.displayName)) {
            this.editing = true;
        }

        this.selectedTeam = `${this.player?.team ?? ""}`;
    }

    get showSaveButton(): boolean {
        return this.displayNameValue !== this.displayName || this.alwaysShowSave;
    }

    @Watch("displayName")
    onDisplayNameChanged(name: string) {
        logger.info("Display Name changed to " + name);
        this.displayNameValue = name;
    }

    get teamOptions(): { value: string; displayName: string }[] {
        if (!this.game) {
            return [];
        }
        const options: { value: string; displayName: string }[] = [];
        for (let i = 0; i < this.game.numberOfTeams; i++) {
            options.push({ value: `${i}`, displayName: this.game.getTeamName(i) });
        }
        return options;
    }

    async save() {
        this.editing = false;
        await this.$store.dispatch(Auth.Actions.setDisplayName, {
            displayName: this.displayNameValue
        });

        await this.$store.dispatch(GameStore.Actions.updatePlayer);
        await this.$store.dispatch(GameStore.Actions.setTeam, { team: this.selectedTeam ? Number(this.selectedTeam) : undefined });
        this.$emit("saved", this.displayName);
    }
}
</script>

<style lang="scss" scoped>
@import "common";
@import "mixins";
@import "variables";

.display-name-form {
    display: flex;
    flex-direction: column;
    .input-field {
        display: flex;
        flex: 1;
        max-width: 100%;

        .name-label {
            @include font($sm);
        }
    }

    .name {
        margin-right: spacing($lg);
        font-weight: bold;
    }

    .actions {
        display: flex;
        flex: 1;
        input {
            margin-right: spacing($md);
            /*max-width: 20rem;*/
            flex: 1;
            height: 2rem;
            background-color: transparent;

            &:focus,
            &:hover {
                background-color: white;
            }
        }

        .action-buttons {
            display: flex;
            flex-direction: column;
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
