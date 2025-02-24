import { Button } from "@mui/material";
import tw from "twin.macro";

import { FieldGroup } from "@/components/interactive";
import { useTranslation } from "@/lib/hooks";
import { useSignup } from "@/lib/hooks/features";


export const SignupForm: React.FC = () => {
    const t = useTranslation();
    const { formHandler, formStructure, onSubmit} = useSignup();

    return(
        <form tw="flex flex-col gap-8 mt-8" onSubmit={onSubmit}>
            <FieldGroup
                formHandler={formHandler}
                formStructure={formStructure}
                spacing={tw`gap-4`}
            />
            <Button variant="contained" type="submit">
                {t('common.submit')}
            </Button>
        </form>
    )
}