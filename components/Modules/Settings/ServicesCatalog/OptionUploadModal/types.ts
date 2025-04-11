import { modalCustomProps } from "@/constants/GeneralTypes";


export type modalCustomFormProps = modalCustomProps & {
  idEntity?: number;
  handleSave: (data: any) => void;
  handleUpdate?: (data: any) => void;
};

export type formProjectToImgtype = {
  nameService: string;
  minPrice?: number;
  maxPrice?: number;
};