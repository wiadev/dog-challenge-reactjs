import axios from "axios";
import { ListAllResponseDTO, ImageDTO } from "../models/types";

const apiUrl = 'https://dog.ceo/api/';

export const getListAll = () => {
  return axios.get<ListAllResponseDTO>(`${apiUrl}breeds/list/all`);
};

export const getImage = (name: string) => {
  return axios.get<ImageDTO>(`${apiUrl}breed/${name}/images`);
}
