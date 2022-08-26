export class GlobalConstant {
  ///message
  public static genericError: string = 'something went Wrong.';

  public static unauthorized: string =
    'You are not authorized person to access this page.';

  public static productExistError: string = 'Product already exist';

  public static productAdded: string = 'Product added successfully';

  ///regex
  public static nameRegex = '[a-zA-Z0-9 ]*';

  public static emailRegex = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';

  public static contactNumberRegex = '^[e0-9]{10,11}$';

  public static quantityRegex = '[0-9]*';

  //variable
  public static error: string = 'error';
}
