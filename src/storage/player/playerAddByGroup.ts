import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/appError";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playerGetByGroup } from './playersGetByGroup'
import { PlayerStorageDTO } from "./playerStorageDTO";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string){
    try {

        const storedPlayers = await playerGetByGroup(group);

        const playerAlreadyExists = storedPlayers.filter(player => player.name === newPlayer.name);

        if(playerAlreadyExists.length > 0){
            throw new AppError('Essa pessoa já está em um time');
        }

        const storage = JSON.stringify([...storedPlayers, newPlayer]);

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
    } catch (error) {
        throw error;
    }
}