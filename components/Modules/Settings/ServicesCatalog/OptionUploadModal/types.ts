export type modalCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    idUser?: string;
  };

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