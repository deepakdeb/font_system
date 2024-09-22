<?php

namespace FontSystem\Manager;

interface FontGroupManagerInterface
{
    public function createGroup(string $groupName, array $fontGroupData): array;
    public function getGroups(): array;
    public function deleteGroup(int $groupId): array;
}