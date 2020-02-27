export interface ListAllResponseDTO {
  status: string;
  message: {
    [key: string]: string[]
  }
}

export interface ImageDTO {
  status: string;
  message: string[];
}
