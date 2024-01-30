import { useState, useEffect, useRef } from 'react'
import { Alert, FlatList, TextInput } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { Header } from '@components/Header'
import { ButtonIcon } from '@components/ButtonIcon'
import { Highlight } from '@components/Highlight'
import { PlayerCard } from '@components/PlayerCard'
import { Button } from '@components/Button'

import { Container, Form, HeaderList, NumbersOfPlayers } from './styles'
import { ListEmpty } from '@components/ListEmpty'
import { AppError } from '@utils/appError'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import { PlayerStorageDTO } from '@storage/player/playerStorageDTO'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'

type RouteParams = {
    group: string;
}

export function Players(){
    const [ team, setTeam ] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [newPlayer, setNewPlayer] = useState('')

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const navigation = useNavigation()

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer(){
        if(newPlayer.trim().length === 0){
            return Alert.alert("Nova Pessoa", 'Informe o nome da pessoa para adicionar')
        }

        const newPlayerData = {
            name: newPlayer,
            team,
        }

        try{
            await playerAddByGroup(newPlayerData, group);

            newPlayerNameInputRef.current?.blur()

            setNewPlayer('')
            fetchPlayersByTeam();

        }catch(error){
            if(error instanceof AppError){
                Alert.alert(error.message);
            }else{
                console.log(error)
            }
        }
    }

    async function fetchPlayersByTeam(){
        try{
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }catch(error){
            console.log(error);
        }
    }

    async function handleRemovePlayer(playerName: string){
        try{
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        }catch(error){
            console.log(error);
            Alert.alert('Remover pessoa', 'Não foi possivel remover a pessoa');
        }
    }

    async function groupRemove(){
        try{
            await groupRemoveByName(group);
            navigation.navigate('groups');
        }catch(error){
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possivel remover a grupo');
        }
    }

    async function handleGroupRemove(){
        Alert.alert('Remover', 'Deseja remover o grupo?', [
            {text: 'Não', style: 'cancel'},
            {text: 'Sim', onPress: () => groupRemove()}
        ])
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team])
    
    return(
        <Container>
            <Header showBackButton/>

            <Highlight title={group} subtitle='adicione a galera e separe os times'/>

        <Form>
            <Input inputRef={newPlayerNameInputRef} placeholder='Nome da Pessoa' autoCorrect={false} onChangeText={setNewPlayer} value={newPlayer} onSubmitEditing={handleAddPlayer} returnKeyType='done'/>
            <ButtonIcon icon="add" onPress={handleAddPlayer}/>
        </Form>

        <HeaderList>
            <FlatList
                data={['Time A', 'Time B']}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Filter title={item} isActive={item === team} onPress={()=>setTeam(item)}/>
                )}
                horizontal
            />
            <NumbersOfPlayers>{players.length}</NumbersOfPlayers>

        </HeaderList>
        
        <FlatList
            data={players}
            keyExtractor={item=>item.name}
            renderItem={({ item }) => (
                <PlayerCard name={item.name} onRemove={()=>{handleRemovePlayer(item.name)}} />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={()=> (
                <ListEmpty
                    message='Não há pessoas nesse time'
                />
            )}
            contentContainerStyle={[ { paddingBottom: 100 }, players.length === 0 && { flex: 1 } ]}
        />

        <Button title="Remover Turma" type="SECONDARY" onPress={()=> handleGroupRemove()}/>
    </Container>
    )
}