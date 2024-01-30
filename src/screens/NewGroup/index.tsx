import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/appError";
import { Alert } from "react-native";

export function NewGroup(){
    const [ group, setGroup ] = useState('')
    const navigation = useNavigation();

    async function handleNew(){
        try{
            if(group.trim().length === 0){
                return Alert.alert('Novo Grupo', 'Informe o Nome da Turma');
            }

            await groupCreate(group);
            navigation.navigate('players', { group });

        }catch(error){
            if(error instanceof AppError){
                Alert.alert('Novo Grupo', error.message);
                console.log(error);
            }
        }
    }

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon/>
                <Highlight title="Nova Turma" subtitle="crie a turma para adicionar as pessoas"/>
                <Input placeholder="Nome da Turma" onChangeText={setGroup}/>
                <Button title="Criar" style={{ marginTop: 20}} onPress={handleNew} />
            </Content>
        </Container>
    )
}