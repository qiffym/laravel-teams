<?php

namespace App;

enum TeamRoleEnum: string
{
    case OWNER = 'team owner';
    case ADMIN = 'team admin';
    case MEMBER = 'team member';
}
