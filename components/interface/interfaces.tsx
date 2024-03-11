interface User {
  username: string;
  is_active: boolean;
  password: string;
}

export interface Member {
  user: User;
  first_name: string;
  last_name: string;
  nrc: string;
  member_mobile: string;
  address_1: string;
  address_2: string;
  town: string;
  province: string;
  country: string;
  bank_name: string;
  branch_name: string;
  branch_code: string;
  account_number: string;
  branch_address: string;
  next_of_kin_fullname: string;
  next_of_kin_nrc: string;
  next_of_kin_mobile: string;
}

export interface SubmitError {
  errorMessage: string;
  isError: boolean;
}

export interface Credentials {
  username: string;
}
