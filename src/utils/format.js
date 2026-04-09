export const formatValidationError = (errors) => {
    if( !errors || !errors.issues) return 'validation failed';

    if(Array.isArray(errors.issues)) return errors.issues.map(i => i.message).join(', ');

    return JSON.stringify(errors);
}

//this is a zod validation fail and error in readable form for the user and logging error 