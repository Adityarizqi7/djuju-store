<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Note;
use Illuminate\Http\Request;

class ReportController extends Controller {
    
    public function index() {
        $notes = Note::with('product')
            ->where('is_finished', 'Y')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Report/ReportDay', [
            'notes' => $notes,
        ]);
    }

    public function delete($id) {
        Note::destroy($id);
        return redirect()->route('report.dashboard');
    }

    public function period() {
        return Inertia::render('Admin/Report/ReportPeriodDash');
    }

    public function week_period() {
        $notes = Note::with('product')
            ->where('is_finished', 'Y')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Report/ReportWeek', [
            'notes' => $notes,
        ]);
    }

    public function month_period() {
        $notes = Note::with('product')
            ->where('is_finished', 'Y')
            ->orderBy('id', 'asc')
            ->get();
        $modal = Asset::all();

        return Inertia::render('Admin/Report/ReportMonth', [
            'notes' => $notes,
            'modal' => $modal,
        ]);
    }

    public function year_period() {
        $notes = Note::with('product')
            ->where('is_finished', 'Y')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Report/ReportYear', [
            'notes' => $notes,
        ]);
    }

    public function range_period() {
        $notes = Note::with('product')
            ->where('is_finished', 'Y')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Report/ReportRangeDate', [
            'notes' => $notes,
        ]);
    }
}
