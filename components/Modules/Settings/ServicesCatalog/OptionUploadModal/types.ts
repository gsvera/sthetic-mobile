export type modalCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    idUser?: string;
  };

  export type modalCustomFormProps = modalCustomProps & {
    handleSave: (data: any) => void;
  };